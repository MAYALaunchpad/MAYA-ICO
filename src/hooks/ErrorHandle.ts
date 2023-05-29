export interface BuyErrorHandle {
    InsufficientBalError: boolean;
    MinAmountError: boolean;
    MaxAmountError: boolean;
    PercentageError: boolean;
    IsNotWhitelistError: boolean;
    IncorrectRefError: boolean;
    InvalidRefError: boolean;
}

export const BuyErrorInitState: BuyErrorHandle = {
    InsufficientBalError: false,
    MinAmountError: false,
    MaxAmountError: false,
    PercentageError: false,
    IsNotWhitelistError: false,
    IncorrectRefError: false,
    InvalidRefError: false,
  };