import { supabase } from '../supabaseClient';
import { Transaction } from '../types';

const getUserId = async (): Promise<string> => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error('No active session');
  }
  return data.user.id;
};

export const api = {
  async getTransactions(limit?: number): Promise<Transaction[]> {
    let userId = '';
    try {
      userId = await getUserId();
    } catch (e) {
      console.error(e);
      return [];
    }
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (typeof limit === 'number') {
      query = query.limit(limit);
    }
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching transactions:', JSON.stringify(error, null, 2));
      return [];
    }
    return data as Transaction[];
  },

  async addTransaction(amount: number, type: 'deposit' | 'withdrawal', description: string): Promise<boolean> {
    let userId = '';
    try {
      userId = await getUserId();
    } catch (e) {
      console.error(e);
      return false;
    }
    const { error } = await supabase
      .from('transactions')
      .insert([
        { amount, type, description, user_id: userId }
      ]);

    if (error) {
      console.error('Error adding transaction:', JSON.stringify(error, null, 2));
      return false;
    }
    return true;
  },

  async getBalance(): Promise<number> {
    // For a production app, we would use a database view or RPC.
    // For this prototype, we calculate client-side based on all history or a materialized view.
    // Let's just fetch all rows (assuming reasonably low volume for a prototype) or use a SUM query.

    // Efficient way:
    let userId = '';
    try {
      userId = await getUserId();
    } catch (e) {
      console.error(e);
      return 0;
    }
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('user_id', userId);

    if (error || !data) {
      if (error) console.error('Error calculating balance:', JSON.stringify(error, null, 2));
      return 0;
    }

    return data.reduce((acc, curr) => {
      if (curr.type === 'deposit') return acc + Number(curr.amount);
      if (curr.type === 'withdrawal') return acc - Number(curr.amount);
      return acc;
    }, 0);
  }
};
