import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";

export class SchedulerDto {
    @IsString()
    @ApiProperty({
        description: "Nome do cliente",
        type: String,
        example: "Raphael Frajuca",
    })
    readonly name: string;

    @IsPhoneNumber("BR")
    @ApiProperty({
        description: "Telefone do cliente",
        type: String,
        example: "+5511999999999",
    })
    readonly phone: string;

    @IsString()
    @MinLength(11)
    @MaxLength(11)
    @ApiProperty({
        description: "CPF do cliente",
        type: String,
        example: "12345678901",
    })
    readonly cpf: string;

    @IsString()
    @ApiProperty({
        description: "Modelo do carro",
        type: String,
        example: "Gol",
    })
    readonly carModel: string;

    @IsString()
    @MinLength(7)
    @MaxLength(7)
    @ApiProperty({
        description: "Placa do carro",
        type: String,
        example: "ABC1234",
    })
    readonly carLicensePlate: string;

    @IsDate()
    @Transform(({ value }) => {
        const [datePart, timePart] = value.split(" ");
        const [day, month, year] = datePart.split("/");
        const [hours, minutes] = timePart.split(":");
        const isoDateString = `${year}-${month}-${day}T${Number(hours) + 3}:${minutes}:00.000Z`;
        return new Date(isoDateString);
    })
    readonly dateTime: Date;
}
