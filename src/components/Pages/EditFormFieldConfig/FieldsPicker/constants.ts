
export const ValueTypes = Object.freeze({
    TEXT: 'TEXT',
    LONG_TEXT: 'LONG_TEXT',
    LETTER: 'LETTER',
    PHONE_NUMBER: 'PHONE_NUMBER',
    EMAIL: 'EMAIL',
    BOOLEAN: 'BOOLEAN',
    TRUE_ONLY: 'TRUE_ONLY',
    DATE: 'DATE',
    DATETIME: 'DATETIME',
    TIME: 'TIME',
    NUMBER: 'NUMBER',
    INTEGER: 'INTEGER',
    INTEGER_POSITIVE: 'INTEGER_POSITIVE',
    INTEGER_NEGATIVE: 'INTEGER_NEGATIVE',
    INTEGER_ZERO_OR_POSITIVE: 'INTEGER_ZERO_OR_POSITIVE',
    PERCENTAGE: 'PERCENTAGE',
    URL: 'URL',
    FILE_RESOURCE: 'FILE_RESOURCE',
    COORDINATE: 'COORDINATE',
    ORGANISATION_UNIT: 'ORGANISATION_UNIT',
    AGE: 'AGE',
    USERNAME: 'USERNAME',
});

export const LabelByValueType: Record<string, string> = {
    [ValueTypes.TEXT]: 'Text',
    [ValueTypes.LONG_TEXT]: 'Long text',
    [ValueTypes.LETTER]: 'Letter',
    [ValueTypes.PHONE_NUMBER]: 'Phone number',
    [ValueTypes.EMAIL]: 'Email',
    [ValueTypes.BOOLEAN]: 'Boolean',
    [ValueTypes.TRUE_ONLY]: 'True only',
    [ValueTypes.DATE]: 'Date',
    [ValueTypes.DATETIME]: 'Datetime',
    [ValueTypes.TIME]: 'Time',
    [ValueTypes.NUMBER]: 'Number',
    [ValueTypes.INTEGER]: 'Integer',
    [ValueTypes.INTEGER_POSITIVE]: 'Integer positive',
    [ValueTypes.INTEGER_NEGATIVE]: 'Integer negative',
    [ValueTypes.INTEGER_ZERO_OR_POSITIVE]: 'Integer zero or positive',
    [ValueTypes.PERCENTAGE]: 'Percentage',
    [ValueTypes.URL]: 'URL',
    [ValueTypes.FILE_RESOURCE]: 'File resource',
    [ValueTypes.COORDINATE]: 'Coordinate',
    [ValueTypes.ORGANISATION_UNIT]: 'Organisation unit',
    [ValueTypes.AGE]: 'Age',
    [ValueTypes.USERNAME]: 'Username',
};
