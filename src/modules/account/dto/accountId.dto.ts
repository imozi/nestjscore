import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AccountIdDto {
  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @IsString({ message: 'Поле должно быть не пустой строкой' })
  @IsUUID()
  readonly id: string;
}
