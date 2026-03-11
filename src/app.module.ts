import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/validate';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { Config } from './config/config.schema';
import { TarotModule } from './modules/tarot.module';
import { DevController } from './dev.controller';
import { AuthModule } from './modules/auth.module';
import { UserModule } from './modules/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validate,
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      inject: [ConfigModule],
      useFactory: () => ({
        secret: process.env.AUTH_GATEWAY_JWT_SECRET as string,
        global: true,
      }),
    }),
    TarotModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController, DevController],
})
export class AppModule {}
