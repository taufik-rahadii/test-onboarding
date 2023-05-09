# AIT Template - BoilerPlate Service

BoilerPlate service for AIT Template microservice.

## Table of Contents

- [AIT Template - BoilerPlate Service](#ait-template---boilerplate-service)
  - [Table of Contents](#table-of-contents)
  - [General Information](#general-information)
  - [Technologies Used](#technologies-used)
  - [Setup](#setup)
  - [Use](#use)
    - [Auth](#auth)

## General Information

- Backend uses microservices architecture with NestJS as primary framework

## Technologies Used

- NestJS - version 14.17.0-alpine
- PostgreSQL
- JSON Web Token for auth

## Setup

- Copy `.env.example` to `.env` and fill in the parameters
- `yarn install`
- `yarn start:dev`


## Use
### Auth
- **@UserType** is used to identify the user type, you can fill more than one by using ","
  ```ts
  
  @Get('my-profile')
  @UserType('admin', 'mechant')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async myProfile(@User() user: IUser) {
    const profile = await this.profileService.findOne(user.id);
    return this.responseService.success(profile);
  }
  ```

- **@UserTypeAndLevel** is used to identify the user type and level, you can fill more than one by using ","  
  ```ts
  
  @Get('my-profile')
  @UserTypeAndLevel('admin.*', 'mechant.store')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async myProfile(@User() user: IUser) {
    const profile = await this.profileService.findOne(user.id);
    return this.responseService.success(profile);
  }
  ```

- **@Permission** is used to limit who has this permission 
  ```ts
  
  @Get('my-profile')
  @Permission('profile.read')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async myProfile(@User() user: IUser) {
    const profile = await this.profileService.findOne(user.id);
    return this.responseService.success(profile);
  }

- **@User** is used to get User data from access token
  ```ts
  
  @Get('my-profile')
  @Permission('profile.read')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async myProfile(@User() user: IUser) {
    const profile = await this.profileService.findOne(user.id);
    return this.responseService.success(profile);
  }
