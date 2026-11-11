-- ==============================================================================
-- TROYX ISTORE — PRODUCTION DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Location: Bawaleshie, East Legon, Accra, Ghana
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ROLES
CREATE TYPE user_role AS ENUM ('owner', 'editor', 'viewer');

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles can be viewed by authenticated staff"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only owners can update user roles"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'owner'
        )
    );

-- 2. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by UUID REFERENCES public.profiles(id)
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings are publicly viewable"
    ON public.site_settings FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Only staff can update site settings"
    ON public.site_settings FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('owner', 'editor')
        )
    );

-- 3. PAGES
CREATE TABLE IF NOT EXISTS public.pages (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    og_image_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT false,
    in_navigation BOOLEAN NOT NULL DEFAULT false,
    navigation_order INTEGER NOT NULL DEFAULT 0,
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_by UUID REFERENCES public.profiles(id)
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published pages are publicly viewable"
    ON public.pages FOR SELECT
    TO anon, authenticated
    USING (is_published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage pages"
    ON public.pages FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('owner', 'editor')
        )
    );

-- 4. PAGE SECTIONS
CREATE TABLE IF NOT EXISTS public.sections (
    id TEXT PRIMARY KEY,
    page_id TEXT NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
    section_type TEXT NOT NULL,
    draft_label TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    tagline TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT false,
    theme TEXT NOT NULL DEFAULT 'dark',
    background_color TEXT,
    text_color TEXT,
    text_alignment TEXT NOT NULL DEFAULT 'center',
    desktop_image_url TEXT,
    mobile_image_url TEXT,
    desktop_video_url TEXT,
    mobile_video_url TEXT,
    poster_image_url TEXT,
    media_type TEXT NOT NULL DEFAULT 'none',
    learn_more_url TEXT,
    learn_more_text TEXT DEFAULT 'Learn more',
    buy_url TEXT,
    buy_text TEXT DEFAULT 'Buy',
    animation_settings JSONB DEFAULT '{}'::jsonb,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published sections are publicly viewable"
    ON public.sections FOR SELECT
    TO anon, authenticated
    USING (is_published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage sections"
    ON public.sections FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('owner', 'editor')
        )
    );

-- 5. PAGE REVISIONS & ROLLBACK
CREATE TABLE IF NOT EXISTS public.page_revisions (
    id TEXT PRIMARY KEY,
    page_id TEXT NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content_snapshot JSONB NOT NULL,
    revision_notes TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.page_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view and create revisions"
    ON public.page_revisions FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('owner', 'editor')
        )
    );

-- 6. MEDIA ASSETS
CREATE TABLE IF NOT EXISTS public.media_assets (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    media_type TEXT NOT NULL, -- 'image' or 'video'
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    focal_point_x NUMERIC(5, 2) DEFAULT 50.00,
    focal_point_y NUMERIC(5, 2) DEFAULT 50.00,
    folder TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_by UUID REFERENCES public.profiles(id)
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Media assets are publicly viewable"
    ON public.media_assets FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Staff can upload and manage media"
    ON public.media_assets FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('owner', 'editor')
        )
    );

-- 7. PRODUCT CATALOG
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    brand TEXT NOT NULL DEFAULT 'Apple',
    model TEXT NOT NULL,
    category TEXT NOT NULL, -- 'iphone', 'mac', 'ipad', 'watch', 'airpods', 'accessories'
    description TEXT,
    condition TEXT NOT NULL DEFAULT 'Brand New',
    sim_config TEXT NOT NULL DEFAULT 'Physical SIM',
    battery_health INTEGER,
    is_published BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    sku TEXT NOT NULL UNIQUE,
    base_price NUMERIC(12, 2) NOT NULL,
    discount_price NUMERIC(12, 2),
    learn_more_page_id TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published products are publicly viewable"
    ON public.products FOR SELECT
    TO anon, authenticated
    USING (is_published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage products"
    ON public.products FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('owner', 'editor')
        )
    );

-- 8. PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS public.product_variants (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    storage TEXT,
    ram TEXT,
    color TEXT NOT NULL,
    color_hex TEXT,
    price NUMERIC(12, 2) NOT NULL,
    discount_price NUMERIC(12, 2),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product variants are publicly viewable"
    ON public.product_variants FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Staff can manage product variants"
    ON public.product_variants FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('owner', 'editor')
        )
    );

-- 9. ORDERS & CHECKOUT
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_method TEXT NOT NULL, -- 'pickup' or 'delivery'
    delivery_address TEXT,
    delivery_city TEXT,
    delivery_notes TEXT,
    subtotal NUMERIC(12, 2) NOT NULL,
    discount_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'GH₵',
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'ready_for_pickup', 'out_for_delivery', 'completed', 'cancelled'
    payment_status TEXT NOT NULL DEFAULT 'unpaid', -- 'unpaid', 'paid_on_delivery', 'bank_transfer', 'momo'
    payment_reference TEXT,
    notes TEXT,
    items JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create an order"
    ON public.orders FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Staff can view and update all orders"
    ON public.orders FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('owner', 'editor', 'viewer')
        )
    );

-- 10. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    user_email TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('owner', 'editor', 'viewer')
        )
    );

-- SEED THE 6 EXACT UNPUBLISHED HOMEPAGE SECTIONS
INSERT INTO public.pages (id, slug, title, is_published, in_navigation, navigation_order)
VALUES ('page-home', 'home', 'TroyX iStore — Home of Original Apple Products', true, false, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.sections (id, page_id, section_type, draft_label, sort_order, is_published, theme, background_color, text_color, media_type)
VALUES
('sec-home-draft-1', 'page-home', 'cinematic_hero', 'iPhone 18 Pro — dark', 1, false, 'dark', '#000000', '#f5f5f7', 'none'),
('sec-home-draft-2', 'page-home', 'cinematic_hero', 'iPhone Duo — white', 2, false, 'white', '#ffffff', '#1d1d1f', 'none'),
('sec-home-draft-3', 'page-home', 'cinematic_hero', 'MacBook Pro — dark', 3, false, 'dark', '#000000', '#f5f5f7', 'none'),
('sec-home-draft-4', 'page-home', 'cinematic_hero', 'Apple Watch Series 12 — white', 4, false, 'white', '#ffffff', '#1d1d1f', 'none'),
('sec-home-draft-5', 'page-home', 'cinematic_hero', 'iPad A16 — white', 5, false, 'white', '#ffffff', '#1d1d1f', 'none'),
('sec-home-draft-6', 'page-home', 'cinematic_hero', 'AirPods Pro 3 — dark', 6, false, 'dark', '#000000', '#f5f5f7', 'none')
ON CONFLICT (id) DO NOTHING;
