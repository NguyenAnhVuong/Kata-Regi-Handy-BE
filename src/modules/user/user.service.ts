import { IUserData } from '@core/interface/default.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { EConfiguration } from 'src/core/config/configuration.config';
import { User } from 'src/core/database/entity/user.entity';
import { ERole } from 'src/core/enum/default.enum';
import { ErrorMessage } from 'src/core/enum/error.enum';
import {
  IJwtPayload,
  IResponseAuth,
  IResponseAuthUser,
  IResponseRefreshToken,
} from 'src/core/global/auth/interface/auth.interface';
import { DataSource, DeepPartial, EntityManager, Repository } from 'typeorm';
import { UserDetailService } from './../user-detail/user-detail.service';
import { VSystemRegisterInput } from './dto/system-register.input';
import { VUserLoginDto } from './dto/user-login.dto';
import { VUserRegisterDto } from './dto/user-register.dto';
import { VRestaurantAdminRegisterInput } from './dto/restaurant-admin-register.input';
import { RestaurantService } from '@modules/restaurant/restaurant.service';
import { UserDetail } from '@core/database/entity/userDetail.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userDetailService: UserDetailService,
    private dataSource: DataSource,
    private restaurantService: RestaurantService,
  ) {}
  async userRegister(userRegister: VUserRegisterDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: userRegister.email,
      },
    });

    if (user) {
      throw new HttpException(
        ErrorMessage.ACCOUNT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(userRegister.password, salt);

    userRegister.password = hashPassword;
    return await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        const userDetail = {
          name: userRegister.name,
          birthday: userRegister.birthday,
          gender: userRegister.gender,
        };
        const newUserDetail = await this.userDetailService.createUserDetail(
          userDetail,
          entityManager,
        );

        const userRepository = entityManager.getRepository(User);
        const newUser = await userRepository.save({
          userDetailId: newUserDetail.id,
          ...userRegister,
        });
        delete newUser.password;

        return newUser;
      },
    );
  }

  async systemRegister(systemRegister: VSystemRegisterInput) {
    if (
      systemRegister.systemRegisterCode !==
      this.configService.get<string>(EConfiguration.SYSTEM_REGISTER_CODE)
    ) {
      throw new HttpException(
        ErrorMessage.SYSTEM_REGISTER_CODE_INCORRECT,
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepository.findOne({
      where: {
        email: systemRegister.email,
      },
    });

    if (user) {
      throw new HttpException(
        ErrorMessage.ACCOUNT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(systemRegister.password, salt);

    systemRegister.password = hashPassword;

    delete systemRegister.systemRegisterCode;

    return await this.userRepository.save({
      ...systemRegister,
      role: ERole.SYSTEM,
    });
  }

  async restaurantAdminRegister(
    userData: IUserData,
    restaurantAdminRegister: VRestaurantAdminRegisterInput,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        email: restaurantAdminRegister.email,
      },
    });

    if (user) {
      throw new HttpException(
        ErrorMessage.ACCOUNT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        const newRestaurant = await this.restaurantService.createRestaurant(
          { ...restaurantAdminRegister.restaurant, creatorId: userData.uid },
          entityManager,
        );

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(
          restaurantAdminRegister.password,
          salt,
        );

        restaurantAdminRegister.password = hashPassword;

        const newUser = await entityManager.getRepository(User).save({
          email: restaurantAdminRegister.email,
          password: hashPassword,
          restaurantId: newRestaurant.id,
          role: ERole.RESTAURANT_ADMIN,
        });

        const userDetail: DeepPartial<UserDetail> = {
          name: restaurantAdminRegister.name,
          birthday: restaurantAdminRegister.birthday,
          phone: restaurantAdminRegister.phone,
          gender: restaurantAdminRegister.gender,
        };
        await this.userDetailService.createUserDetail(
          userDetail,
          entityManager,
        );

        return newUser;
      },
    );
  }

  async userLogin(
    userLogin: VUserLoginDto,
    response: Response,
  ): Promise<IResponseAuth> {
    const user = await this.userRepository.findOne({
      where: {
        email: userLogin.email,
      },
    });

    if (!user) {
      throw new HttpException(
        ErrorMessage.ACCOUNT_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const isMatch = await bcrypt.compare(userLogin.password, user.password);

    if (!isMatch) {
      throw new HttpException(
        ErrorMessage.PASSWORD_INCORRECT,
        HttpStatus.BAD_REQUEST,
      );
    }

    const authUserData: IResponseAuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      restaurantId: user.restaurantId,
    };

    return await this.returnResponseAuthUser(authUserData, response);
  }

  async refreshToken(
    refreshToken: string,
    response: Response,
  ): Promise<IResponseRefreshToken> {
    const user = await this.userRepository.findOne({
      where: {
        refreshToken,
      },
    });

    if (!user) {
      throw new HttpException(
        ErrorMessage.ACCOUNT_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const authUserData: IResponseAuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      restaurantId: user.restaurantId,
    };

    const data = await this.returnResponseAuthUser(authUserData, response);

    return {
      accessToken: data.accessToken,
    };
  }

  async returnResponseAuthUser(
    authUserData: IResponseAuthUser,
    response: Response,
  ): Promise<IResponseAuth> {
    const payload: IJwtPayload = {
      uid: authUserData.id,
      eml: authUserData.email,
      rol: authUserData.role,
      rid: authUserData.restaurantId,
    };

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<number>(
        EConfiguration.REFRESH_TOKEN_EXPIRES_IN,
      ),
    });

    await this.userRepository.update(authUserData.id, { refreshToken });
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: this.configService.get<number>(
        EConfiguration.REFRESH_TOKEN_EXPIRES_IN,
      ),
    });
    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: authUserData,
    };
  }

  async getAllUser() {
    const userList = await this.userRepository.find();

    return userList.map((user) => {
      delete user.password;
      delete user.refreshToken;
      return user;
    });
  }

  async getUserById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateUserById(
    id: number,
    data: DeepPartial<User>,
    entityManager?: EntityManager,
  ) {
    const userRepository = entityManager
      ? entityManager.getRepository(User)
      : this.userRepository;
    return await userRepository.update(id, data);
  }

  async userLogout(userData: IUserData, response: Response) {
    const { uid } = userData;
    const user = await this.userRepository.findOne({
      where: {
        id: uid,
      },
    });

    if (!user) {
      throw new HttpException(
        ErrorMessage.ACCOUNT_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.userRepository.update(userData.uid, { refreshToken: null });
    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    return true;
  }

  async getUser(userData: IUserData) {
    const user = await this.userRepository.findOne({
      where: {
        id: userData.id,
      },
      relations: ['userDetail'],
    });
    return user;
  }
}
