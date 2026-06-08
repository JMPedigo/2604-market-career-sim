import db from "#db/client";
import { faker } from "@faker-js/faker";
import { createProduct } from "#db/queries/products";
import { createUser } from "#db/queries/users";
import { createOrder } from "#db/queries/orders";
import { createPackingList } from "#db/queries/packing_list";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded successfully!");

async function seed() {
  const seededProducts = [];

  // 1. Seed 20 products and save their real database IDs
  for (let i = 1; i <= 20; i++) {
    const product = await createProduct({
      title: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price({ min: 10, max: 200, dec: 2 }),
    });
    seededProducts.push(product); // Saves the product containing its true id
  }

  // 2. Seed 4 users, each with 1 order
  for (let i = 1; i <= 4; i++) {
    const user = await createUser({
      username: faker.internet.username(),
      password: faker.internet.password(),
    });

    const order = await createOrder({
      date: faker.date.recent({ days: 30 }),
      note: faker.finance.transactionType(),
      user_id: user.id,
    });

    // 3. Link 5 distinct products using the actual database IDs
    for (let j = 0; j < 5; j++) {
      // Calculate a unique index position (0 through 19) inside our array
      const productIndex = (i - 1) * 5 + j;
      const realProductId = seededProducts[productIndex].id;

      await createPackingList({
        orderId: order.id,
        productId: realProductId, // Uses the real, current database auto-incremented ID
        quantity: faker.number.int({ min: 1, max: 99 }),
      });
    }
  }
}
