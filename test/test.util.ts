import { prismaClient } from "../src/application/database";
import { hashPass } from "../src/helpers/bcrypt";

export class UserTest {
  static async delete() {
    await prismaClient.user.deleteMany({
      where: {
        username: "test",
      },
    });
  }

  static async create() {
    await prismaClient.user.create({
      data: {
        username: "test",
        name: "test",
        password: hashPass("test"),
        token: "test",
      },
    });
  }
}
