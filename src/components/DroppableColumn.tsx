import type { ReactNode } from 'react';

import { useDroppable } from '@dnd-kit/core'; 

export function DroppableColumn({ id, children, dropColor = 'ring-blue-400' }: { id: string; children: ReactNode; dropColor?: string }) { 
  const { setNodeRef, isOver } = useDroppable({ id }); 
  return ( 
    <div ref={setNodeRef} 
         className={`transition ${isOver ? `ring-2 ${dropColor} ring-offset-2 rounded-xl` : ''}`}> 
      {children} 
    </div> 
  ); 
}