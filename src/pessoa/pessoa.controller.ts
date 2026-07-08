import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PessoaService } from './pessoa.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';

@Controller('pessoa')
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) {}

  // POST /pessoa
  @Post()
  create(@Body() createPessoaDto: CreatePessoaDto) {
    return this.pessoaService.create(createPessoaDto);
  }

  // GET /pessoa
  @Get()
  findAll() {
    return this.pessoaService.findAll();
  }

  // GET /pessoa/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pessoaService.findOne(id);
  }

  // PATCH /pessoa/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePessoaDto: UpdatePessoaDto,
  ) {
    return this.pessoaService.update(id, updatePessoaDto);
  }

  // DELETE /pessoa/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pessoaService.remove(id);
  }
}
