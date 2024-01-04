import { PipeTransform, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';

export class ReducerValidationPipe implements PipeTransform {
  constructor(
    private readonly classes: ClassConstructor<any>[],
    private readonly options?: ValidationPipeOptions,
  ) {}

  transform(value: any) {
    let instance;
    const failedValidations: ValidationError[][] = [];

    for (const c of this.classes) {
      instance = plainToInstance(c, value);
      const validation = validateSync(instance, this.options);

      if (!validation.length) break;
      failedValidations.push(validation);
    }

    if (failedValidations.length < this.classes.length) return instance;
    throw new ValidationPipe().createExceptionFactory()(failedValidations.flat());
  }
}
