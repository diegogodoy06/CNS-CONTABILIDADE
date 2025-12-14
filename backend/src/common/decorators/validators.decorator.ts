import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Validador customizado de CPF
 */
export function IsCpf(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCpf',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          
          // Remove caracteres não numéricos
          const cpf = value.replace(/\D/g, '');
          
          if (cpf.length !== 11) return false;
          
          // Verifica se todos os dígitos são iguais
          if (/^(\d)\1+$/.test(cpf)) return false;
          
          // Validação dos dígitos verificadores
          let soma = 0;
          for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
          }
          let resto = (soma * 10) % 11;
          if (resto === 10 || resto === 11) resto = 0;
          if (resto !== parseInt(cpf.charAt(9))) return false;
          
          soma = 0;
          for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
          }
          resto = (soma * 10) % 11;
          if (resto === 10 || resto === 11) resto = 0;
          if (resto !== parseInt(cpf.charAt(10))) return false;
          
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser um CPF válido`;
        },
      },
    });
  };
}

/**
 * Validador customizado de CNPJ
 */
export function IsCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCnpj',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          
          // Remove caracteres não numéricos
          const cnpj = value.replace(/\D/g, '');
          
          if (cnpj.length !== 14) return false;
          
          // Verifica se todos os dígitos são iguais
          if (/^(\d)\1+$/.test(cnpj)) return false;
          
          // Validação dos dígitos verificadores
          const calcDigit = (base: string, weights: number[]) => {
            let soma = 0;
            for (let i = 0; i < weights.length; i++) {
              soma += parseInt(base.charAt(i)) * weights[i];
            }
            const resto = soma % 11;
            return resto < 2 ? 0 : 11 - resto;
          };
          
          const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
          const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
          
          const digit1 = calcDigit(cnpj.substring(0, 12), weights1);
          const digit2 = calcDigit(cnpj.substring(0, 12) + digit1, weights2);
          
          return (
            cnpj.charAt(12) === digit1.toString() &&
            cnpj.charAt(13) === digit2.toString()
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser um CNPJ válido`;
        },
      },
    });
  };
}

/**
 * Validador customizado de CPF ou CNPJ
 */
export function IsCpfOrCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCpfOrCnpj',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          
          const doc = value.replace(/\D/g, '');
          
          if (doc.length === 11) {
            // Valida CPF
            if (/^(\d)\1+$/.test(doc)) return false;
            
            let soma = 0;
            for (let i = 0; i < 9; i++) {
              soma += parseInt(doc.charAt(i)) * (10 - i);
            }
            let resto = (soma * 10) % 11;
            if (resto === 10 || resto === 11) resto = 0;
            if (resto !== parseInt(doc.charAt(9))) return false;
            
            soma = 0;
            for (let i = 0; i < 10; i++) {
              soma += parseInt(doc.charAt(i)) * (11 - i);
            }
            resto = (soma * 10) % 11;
            if (resto === 10 || resto === 11) resto = 0;
            if (resto !== parseInt(doc.charAt(10))) return false;
            
            return true;
          } else if (doc.length === 14) {
            // Valida CNPJ
            if (/^(\d)\1+$/.test(doc)) return false;
            
            const calcDigit = (base: string, weights: number[]) => {
              let soma = 0;
              for (let i = 0; i < weights.length; i++) {
                soma += parseInt(base.charAt(i)) * weights[i];
              }
              const resto = soma % 11;
              return resto < 2 ? 0 : 11 - resto;
            };
            
            const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
            const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
            
            const digit1 = calcDigit(doc.substring(0, 12), weights1);
            const digit2 = calcDigit(doc.substring(0, 12) + digit1, weights2);
            
            return (
              doc.charAt(12) === digit1.toString() &&
              doc.charAt(13) === digit2.toString()
            );
          }
          
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser um CPF ou CNPJ válido`;
        },
      },
    });
  };
}

/**
 * Validador de telefone brasileiro
 */
export function IsBrazilianPhone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBrazilianPhone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          const phone = value.replace(/\D/g, '');
          return phone.length >= 10 && phone.length <= 11;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser um telefone brasileiro válido`;
        },
      },
    });
  };
}

/**
 * Validador de CEP brasileiro
 */
export function IsCep(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCep',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          const cep = value.replace(/\D/g, '');
          return cep.length === 8;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser um CEP válido`;
        },
      },
    });
  };
}
