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
    // converter data no formato mm/dd/yyyy para dd/mm/yyyy
    // https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime
    @Transform(({ value }) => {
        const date = new Date(value);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const newDate = new Date(`${day}/${month}/${year} ${hours}:${minutes}`);
        console.log(newDate);
        return newDate;
    })
    @ApiProperty({
        description: "Data e horário do agendamento nos seguintes formatos: dd/mm/yyyy hh:mm",
        type: String,
        example: "09/01/2023 10:30",
    })
    readonly dateTime: Date;
}
