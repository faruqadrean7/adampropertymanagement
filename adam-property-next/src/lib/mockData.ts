import { 
  Project, 
  Kavling, 
  Customer, 
  Payment, 
  LandDebt, 
  LandPayment, 
  CashbookItem, 
  PettyCashItem, 
  InventoryItem, 
  Employee, 
  SalaryPayment 
} from '@/types';

// ==============================================================================
// INITIAL EMPTY FRESH DATABASE FOR PRODUCTION & SUPABASE CLOUD SYNC
// ==============================================================================

export const INITIAL_PROJECTS: Project[] = [];
export const INITIAL_KAVLINGS: Kavling[] = [];
export const INITIAL_CUSTOMERS: Customer[] = [];
export const INITIAL_PAYMENTS: Payment[] = [];
export const INITIAL_LAND_DEBTS: LandDebt[] = [];
export const INITIAL_LAND_PAYMENTS: LandPayment[] = [];
export const INITIAL_CASHBOOK: CashbookItem[] = [];
export const INITIAL_PETTY_CASH: PettyCashItem[] = [];
export const INITIAL_INVENTORY: InventoryItem[] = [];
export const INITIAL_EMPLOYEES: Employee[] = [];
export const INITIAL_SALARY_PAYMENTS: SalaryPayment[] = [];
