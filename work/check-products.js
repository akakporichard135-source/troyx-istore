const products = require('../database/products').products;
const iphones = products.filter(p => p.category === 'iPhone');
console.log(`Total iPhones found: ${iphones.length}`);
iphones.forEach(p => {
  console.log(`- ID: ${p.id}, Name: ${p.name}, Price: ${p.price}, Image: ${p.images[0]}`);
});
