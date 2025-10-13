import re
from typing import Annotated

from phonenumbers import (
    PhoneNumberFormat,
    format_number,
    is_possible_number,
    is_valid_number,
    parse,
)
from pydantic import AfterValidator


def valid_phone_number(phone_number: str):
    phone_number = re.sub(r'[^\d+]', '', phone_number)

    parsed_phone_number = parse(phone_number, 'BR')

    if not is_possible_number(parsed_phone_number):
        raise ValueError('Incorrect phone number')

    if not is_valid_number(parsed_phone_number):
        raise ValueError('Invalid phone number')

    return format_number(parsed_phone_number, PhoneNumberFormat.E164)


PhoneNumber = Annotated[str, AfterValidator(valid_phone_number)]
