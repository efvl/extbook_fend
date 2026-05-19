'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createCard, deleteCardById, updateCard } from '@/lib/api/cardService';
import { CardStatus } from '@/types/card';

export async function saveCardAction(prevState: any, formData: FormData) {
  const id = formData.get('id') as string | null;
  
  const cardData = {
    txtContent: formData.get('txtContent') as string,
    definition: formData.get('definition') as string,
    targetCount: Number(formData.get('targetCount')) || 0,
    actualCount: Number(formData.get('actualCount')) || 0,
    status: (formData.get('status') as CardStatus) || 'NEW',
  };

  if (!cardData.txtContent || cardData.txtContent.length > 128) {
    return { error: 'Text content is required and must be under 128 characters.' };
  }
  if (!cardData.definition || cardData.definition.length > 512) {
    return { error: 'Definition is required and must be under 512 characters.' };
  }

  try {
    if (id) {
      await updateCard(id, cardData);
    } else {
      await createCard(cardData);
    }
  } catch (err: any) {
    return { error: err.message || 'Failed to save the card.' };
  }

  revalidatePath('/ui/cards');
  redirect('/ui/cards');
}

export async function deleteCardAction(id: string): Promise<void> {
  try {
    await deleteCardById(id);
    revalidatePath('/ui/cards');
    // No return needed for success if you're just revalidating
  } catch (error) {
    console.error(error);
  }
}