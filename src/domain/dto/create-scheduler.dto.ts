import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsPhoneNumber, IsString } from "class-validator";

export class CreateSchedulerDto {
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
    @ApiProperty({
        description: "Modelo do carro",
        type: String,
        example: "Gol",
    })
    readonly carModel: string;

    @IsDate()
    @ApiProperty({
        description: "Data e horário do agendamento nos seguintes formatos: dd/mm/yyyy hh:mm, yyyy/mm/dd hh:mm",
        type: String,
        example: "09/01/2023 10:30",
    })
    @Transform(({ value }): Date => {
        try {
            const date = new Date(value);
            date.setHours(date.getHours() - 3);
            return date;
        } catch (error) {
            console.error(error);
            throw new BadRequestException("Invalid date format");
        }
    })
    readonly dateTime: Date;
}
