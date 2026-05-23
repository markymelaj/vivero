export type UserRole = "admin" | "operador" | "vendedor" | "aliado";

export type AppUser = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  password_hash?: string;
  commission_rate: number;
  active: boolean;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  presentation: string;
  retail_price: number;
  wholesale_price: number;
  consignment_render_price: number;
  cost_price: number;
  stock_owned: number;
  stock_reserved: number;
  stock_consigned: number;
  active: boolean;
  notes?: string | null;
};

export type Partner = {
  id: string;
  code: string;
  type: string;
  business_name: string;
  contact_name?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  zone?: string | null;
  agreement_type: string;
  default_commission_rate: number;
  seller_id?: string | null;
  portal_token: string;
  active: boolean;
  notes?: string | null;
};

export type ConsignmentSummary = {
  id: string;
  code: string;
  partner_id: string;
  partner_name: string;
  partner_type: string;
  partner_whatsapp?: string | null;
  partner_zone?: string | null;
  portal_token: string;
  seller_id?: string | null;
  seller_name?: string | null;
  status: string;
  review_date?: string | null;
  delivered_at?: string | null;
  received_at?: string | null;
  created_at: string;
  total_units_delivered: number;
  total_units_sold: number;
  total_units_remaining: number;
  total_value_delivered: number;
  total_sold: number;
  total_to_render: number;
  local_commission_total: number;
  total_rendered: number;
  pending_to_render: number;
};

export type ConsignmentItemStatus = {
  id: string;
  consignment_id: string;
  product_id: string;
  sku: string;
  product_name: string;
  category: string;
  presentation: string;
  quantity_delivered: number;
  quantity_sold: number;
  quantity_returned: number;
  quantity_damaged: number;
  quantity_missing: number;
  quantity_remaining: number;
  suggested_price: number;
  render_price: number;
  local_commission_unit: number;
  delivered_value: number;
  sold_value: number;
  render_value: number;
  local_commission_value: number;
};

export type Payment = {
  id: string;
  reference_type: string;
  reference_id: string;
  received_amount: number;
  method: string;
  external_reference?: string | null;
  status: string;
  notes?: string | null;
  created_at: string;
};

export type Commission = {
  id: string;
  beneficiary_type: string;
  beneficiary_user_id?: string | null;
  partner_id?: string | null;
  reference_type: string;
  reference_id: string;
  base_amount: number;
  rate: number;
  amount: number;
  status: string;
  notes?: string | null;
  created_at: string;
  paid_at?: string | null;
  pa_app_users?: { full_name: string; email: string } | null;
  pa_partners?: { business_name: string } | null;
};
