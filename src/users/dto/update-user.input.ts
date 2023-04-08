import { IsArray, IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, ID, OmitType } from '@nestjs/graphql';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(CreateUserInput, ['password']),
) {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => [ValidRoles], { nullable: true })
  @IsArray()
  @IsOptional()
  roles?: ValidRoles[];

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
