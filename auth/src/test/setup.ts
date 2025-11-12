import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
  // Attach a helper to the global scope for tests. Use `var` so it augments globalThis.
  var signin: () => Promise<string[]>;
}

jest.setTimeout(60000);

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';

  // Allow overriding the mongo binary version via env for CI or local tweaks
  // Default to a newer MongoDB release that is more likely to have macOS arm64 builds
  const binaryVersion = process.env.MONGO_BINARY_VERSION || '6.0.4';

  // Use the create helper to pass binary options
  // mongodb-memory-server will download a MongoDB binary matching this version
  mongo = await MongoMemoryServer.create({
    binary: { version: binaryVersion },
  });

  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

(global as any).signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
}

export { };