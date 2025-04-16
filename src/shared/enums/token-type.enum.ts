// src/shared/enums/token-type.enum.ts
import { registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';


export enum AuthSessionType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',  
}
registerEnumType(AuthSessionType, {
  name: 'AuthSessionType',
  description: 'Session type',
});
export enum AuthSessionStatus {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
  EXPIRED = 'EXPIRED',
}
registerEnumType(AuthSessionStatus, {
  name: 'AuthSessionStatus',
  description: 'Token status',
});
export class AuthSessionTypeEnum {
    @ApiProperty({ enum: AuthSessionType })
    @Expose()
    @IsEnum(AuthSessionType)
    type: AuthSessionType;
}

export class AuthSessionStatusEnum {
    @ApiProperty({ enum: AuthSessionStatus })
    @Expose()
    @IsEnum(AuthSessionStatus)
    status: AuthSessionStatus;
}
