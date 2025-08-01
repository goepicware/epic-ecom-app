import { SET_VOUCHER_LIST } from "../actions";

const voucherlist = (state = [], action) => {
  switch (action.type) {
    case SET_VOUCHER_LIST:
      return [...action.value];
    default:
      return state;
  }
};

export default voucherlist;
