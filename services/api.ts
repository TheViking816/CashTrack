import { supabase } from '../supabaseClient';
import { Transaction, TransactionType } from '../types';

const LOCAL_USER_ID = 'local-user';
const LOCAL_TRANSACTIONS_KEY = 'cashtrack-local-transactions';

const readLocalTransactions = (): Transaction[] => {
  try {
    const raw = window.localStorage.getItem(LOCAL_TRANSACTIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading local transactions:', error);
    return [];
  }
};

const writeLocalTransactions = (transactions: Transaction[]) => {
  window.localStorage.setItem(LOCAL_TRANSACTIONS_KEY, JSON.stringify(transactions));
};

const byNewestFirst = (a: Transaction, b: Transaction) => {
  const dateDiff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  return dateDiff || b.id.localeCompare(a.id);
};

const getUserId = async (): Promise<string> => {
  if (!supabase) {
    return LOCAL_USER_ID;
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error('No active session');
  }
  return data.user.id;
};

export const api = {
  async getTransactions(limit?: number): Promise<Transaction[]> {
    if (!supabase) {
      const transactions = readLocalTransactions().sort(byNewestFirst);
      return typeof limit === 'number' ? transactions.slice(0, limit) : transactions;
    }

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

  async addTransaction(amount: number, type: TransactionType, description: string): Promise<boolean> {
    if (!supabase) {
      const transactions = readLocalTransactions();
      const transaction: Transaction = {
        id: crypto.randomUUID(),
        user_id: LOCAL_USER_ID,
        created_at: new Date().toISOString(),
        amount,
        type,
        description,
      };
      writeLocalTransactions([transaction, ...transactions]);
      return true;
    }

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

  async updateTransaction(
    id: string,
    updates: { amount: number; type: TransactionType; description: string }
  ): Promise<boolean> {
    if (!supabase) {
      const transactions = readLocalTransactions();
      const nextTransactions = transactions.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updates } : transaction
      );
      writeLocalTransactions(nextTransactions);
      return true;
    }

    let userId = '';
    try {
      userId = await getUserId();
    } catch (e) {
      console.error(e);
      return false;
    }

    const { error } = await supabase
      .from('transactions')
      .update({
        amount: updates.amount,
        type: updates.type,
        description: updates.description,
      })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating transaction:', JSON.stringify(error, null, 2));
      return false;
    }
    return true;
  },

  async deleteTransaction(id: string): Promise<boolean> {
    if (!supabase) {
      writeLocalTransactions(readLocalTransactions().filter((transaction) => transaction.id !== id));
      return true;
    }

    let userId = '';
    try {
      userId = await getUserId();
    } catch (e) {
      console.error(e);
      return false;
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting transaction:', JSON.stringify(error, null, 2));
      return false;
    }
    return true;
  },

  async getBalance(): Promise<number> {
    if (!supabase) {
      return readLocalTransactions().reduce((acc, curr) => {
        if (curr.type === 'deposit') return acc + Number(curr.amount);
        if (curr.type === 'withdrawal') return acc - Number(curr.amount);
        return acc;
      }, 0);
    }

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
