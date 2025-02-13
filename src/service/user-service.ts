import { User } from "@prisma/client";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { comparePass, hashPass } from "../helpers/bcrypt";
import {
  CreateUserRequest,
  LoginRequest,
  toUserResponse,
  UpdateUserRequest,
  UserResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import { v4 as uuid } from "uuid";

export class UserService {
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    const registerRequest = Validation.validate(
      UserValidation.REGISTER,
      request
    );

    const totalUserWithSameUsername = await prismaClient.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername != 0) {
      throw new ResponseError(400, "Username already exists");
    }

    registerRequest.password = await hashPass(registerRequest.password);

    const user = await prismaClient.user.create({
      data: registerRequest,
    });

    return toUserResponse(user);
  }

  static async login(request: LoginRequest): Promise<UserResponse> {
    const LoginRequest = Validation.validate(UserValidation.LOGIN, request);

    let user = await prismaClient.user.findUnique({
      where: {
        username: LoginRequest.username,
      },
    });

    if (!user) {
      throw new ResponseError(401, "Username/password is incorrect");
    }

    const validatePassword = await comparePass(
      LoginRequest.password,
      user.password
    );

    if (!validatePassword) {
      throw new ResponseError(401, "Username/password is incorrect");
    }

    user = await prismaClient.user.update({
      where: {
        username: LoginRequest.username,
      },
      data: {
        token: uuid(),
      },
    });

    const response = toUserResponse(user);

    response.token = user.token!;

    return response;
  }

  static async getUser(user: User): Promise<UserResponse> {
    return toUserResponse(user);
  }

  static async update(
    user: User,
    request: UpdateUserRequest
  ): Promise<UserResponse> {
    const updateRequest = Validation.validate(UserValidation.UPDATE, request);

    if (updateRequest.name) {
      updateRequest.name = updateRequest.name;
    }

    if (updateRequest.password) {
      updateRequest.password = await hashPass(updateRequest.password);
    }

    const updatedUser = await prismaClient.user.update({
      where: {
        username: user.username,
      },
      data: user,
    });

    return toUserResponse(updatedUser);
  }
}
