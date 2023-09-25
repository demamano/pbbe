import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as fs from 'fs';
import { PrismaClient, Role } from '@prisma/client';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { Role } from '@prisma/client';
const httpsOptions = {
  key: fs.readFileSync('./secrets/key.pem'),
  cert: fs.readFileSync('./secrets/server.crt'),
};

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  const config = new DocumentBuilder()
    .setTitle('purpose black endpoints')
    .setDescription(' API description')
    .setVersion('1.0')
    .addTag('pb')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document);
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');

    next();
  });
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 10 * 60 * 1000,

        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
    }),
  );

  // const prisma = new PrismaClient();

  // async function createUser(username: string, hashedPassword: string, role: Role) {
  //   const user = await prisma.admin.create({
  //     data: {
  //       username,
  //       hashedPassword,
  //       role,

  //     },
  //   });

  //   return user;
  // }
  // const newUser = await createUser('raban', '$2a$10$F86bQvINtJtdSoJ4YbUwLOqlKh01xGcu8veKHL1xcNwkdQM.i6TUS', 'Admin');

  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors({
    origin: ['http://127.0.0.1:3000'],
    credentials: true,
  });
  await app.listen(3000, () => {});
}
bootstrap();
