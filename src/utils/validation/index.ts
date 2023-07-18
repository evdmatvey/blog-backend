interface ValidationLengthRules {
  min?: number;
  max?: number;
  errorMessage?: string;
}

interface ValidationPrefix {
  value: string;
  regExp: RegExp;
}

interface ValidationRules {
  required?: string;
  email?: string;
  filepath?: string;
  length?: ValidationLengthRules;
}

export class Validation<T> {
  constructor(private readonly _data: T) {}

  public validate(target: keyof T, validationRules: ValidationRules) {
    const value = this._getValueByName(target);
    const isNotEmpty = validationRules.required
      ? this._checkingForEmptiness(value, validationRules.required)
      : true;
    const isLengthCorrect = validationRules.length
      ? this._checkingLength(value, validationRules.length)
      : true;
    const isEmailCorrect = validationRules.email
      ? this._checkingEmail(value, validationRules.email)
      : true;
    const isFilepathCorrect = validationRules.filepath
      ? this._checkingFilepath(value, validationRules.filepath)
      : true;

    return isNotEmpty && isLengthCorrect && isEmailCorrect && isFilepathCorrect;
  }

  public addPrefix<U extends keyof T>(
    target: U,
    prefix: ValidationPrefix,
  ): string {
    const value = this._getValueByName(target);

    if (typeof value == 'string') {
      return prefix.value + value.replace(prefix.regExp, '');
    }
  }

  private _getValueByName<U extends keyof T>(key: U): T[U] {
    return this._data[key];
  }

  private _checkingEmail(
    email: T[keyof T],
    errorMessage: string,
  ): boolean | never {
    if (typeof email !== 'string')
      return this._throwError('Значение email не является строкой');

    const isEmailValid = email.match(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    );

    return isEmailValid ? true : this._throwError(errorMessage);
  }

  private _checkingFilepath(
    filepath: T[keyof T],
    errorMessage: string,
  ): boolean | never {
    if (typeof filepath !== 'string')
      return this._throwError(
        'Значение this._checkingFilepath не является строкой',
      );

    const isFilepathValid = filepath.includes('/uploads/');

    return isFilepathValid ? true : this._throwError(errorMessage);
  }

  private _checkingForEmptiness(
    value: T[keyof T],
    errorMessage: string,
  ): boolean {
    if (typeof value === 'string') {
      return Boolean(value.trim()) ? true : this._throwError(errorMessage);
    }
    return Boolean(value) ? true : this._throwError(errorMessage);
  }

  private _checkingLength(
    value: T[keyof T],
    validationLengthRules: ValidationLengthRules,
  ): boolean {
    if (typeof value !== 'string') {
      this._throwError(
        'Validation | Указанное поле не является массивом или строкой!',
      );
    }
    const { min, max } = validationLengthRules;

    if (min && value.trim().length < min)
      this._throwError(validationLengthRules.errorMessage);

    if (max && value.trim().length > max)
      this._throwError(validationLengthRules.errorMessage);

    return true;
  }

  private _throwError(message: string): never {
    throw new Error(message);
  }
}
