export type Stats = {
    habileteLS: number | null;
    enduranceMaxLS: number | null;
    enduranceCurrentLS: number | null;
    habileteBonusLS: number | null;
    habileteAdv: number | null;
    enduranceAdv: number | null;
    fightLocked: boolean;
}

export const initialStats: Stats = {
    habileteAdv: null,
    habileteLS: null,
    enduranceCurrentLS: null,
    enduranceMaxLS: null,
    habileteBonusLS: null,
    enduranceAdv: null,
    fightLocked: false,
}

type ActionName =
    | 'set_habilete_ls'
    | 'set_endurance_max_ls'
    | 'set_endurance_current_ls'
    | 'set_habilete_bonus_ls'
    | 'set_habilete_adv'
    | 'set_endurance_adv'
    | 'inc_endurance_current_ls'
    | 'reset_adv'
    | 'fight'
    | 'fight_lock'


export type Action =
    | { type: 'set_habilete_ls', payload: number }
    | { type: 'set_endurance_max_ls', payload: number }
    | { type: 'set_endurance_current_ls', payload: number }
    | { type: 'set_habilete_bonus_ls', payload: number }
    | { type: 'set_habilete_adv', payload: number }
    | { type: 'set_endurance_adv', payload: number }
    | { type: 'inc_endurance_current_ls' }
    | { type: 'reset_adv' }
    | { type: 'fight', payload: number}
    | { type: 'fight_lock'}

export const handleAction = (state: Stats, action: Action) => {
    const updatedState = {...state}
    console.log(action);
    switch (action.type) {
        case 'set_habilete_ls':
            updatedState.habileteLS = action.payload;
            return updatedState;
        case 'set_endurance_max_ls':
            updatedState.enduranceMaxLS = action.payload;
            return updatedState;
        case 'set_endurance_current_ls':
            updatedState.enduranceCurrentLS = action.payload;
            return updatedState;
        case 'set_habilete_bonus_ls':
            updatedState.habileteBonusLS = action.payload;
            return updatedState;
        case 'set_habilete_adv':
            updatedState.habileteAdv = action.payload;
            return updatedState;
        case 'set_endurance_adv':
            updatedState.enduranceAdv = action.payload;
            return updatedState;
        case 'inc_endurance_current_ls':
            if (updatedState.enduranceCurrentLS !== null && updatedState.enduranceMaxLS !== null && updatedState.enduranceCurrentLS < updatedState.enduranceMaxLS) {
                updatedState.enduranceCurrentLS = updatedState.enduranceCurrentLS + 1;
                return updatedState;
            } 
            return updatedState;
        case 'reset_adv':
            updatedState.habileteAdv = null;
            updatedState.enduranceAdv = null;
            return updatedState;
        case 'fight_lock': 
            updatedState.fightLocked = true;
            return updatedState;
        case 'fight':
            return handleFight(updatedState, action.payload);
    }
}


function handleFight(state: Stats, roll: number) {
    const {habileteLS, habileteAdv, habileteBonusLS, enduranceAdv, enduranceCurrentLS} = state;
    if (habileteLS === null || habileteAdv === null || enduranceAdv === null || enduranceCurrentLS === null) {
        return state;
    }
    const diceroll = (roll + 9)% 10
    const quotientDattaque = habileteLS + (habileteBonusLS ?? 0) - habileteAdv;

    const results = [
        
        //.         1.      2        3      4       5       6      7        8        9        0    
        /* -11 */ [[0,  ], [0,  ], [0, 8], [0, 8], [1, 7], [2, 6], [3, 5], [4, 4], [5, 3], [6, 0]],
        /* -10 */ [[0,  ], [0, 8], [0, 7], [1, 7], [2, 6], [3, 6], [4, 5], [5, 4], [6, 3], [7, 0]],
        /* -8  */ [[0, 8], [0, 7], [1, 6], [2, 6], [3, 5], [4, 5], [5, 4], [6, 3], [7, 2], [8, 0]],
        /* -6  */ [[0, 6], [1, 6], [2, 5], [3, 5], [4, 4], [5, 4], [6, 3], [7, 2], [8, 0], [9, 0]], 
        /* -4  */ [[1, 6], [2, 5], [3, 5], [4, 4], [5, 4], [6, 3], [7, 2], [8, 1], [9, 0], [10, 0]],
        /* -2  */ [[2, 5], [3, 5], [4, 4], [5, 4], [6, 3], [7, 2], [8, 2], [9, 1], [10, 0], [11, 0]],
        /*  0  */ [[3, 5], [4, 4], [5, 4], [6, 3], [7, 2], [8, 2], [9, 1], [10, 0], [11, 0], [12, 0]],
        /* +1  */ [[4, 5], [5, 4], [6, 3], [7, 3], [8, 2], [9, 2], [10, 1], [11, 0], [12, 0], [14, 0]],
        /* +3  */ [[5, 4], [6, 3], [7, 3], [8, 2], [9, 2], [10, 2], [11, 1], [12, 0], [14, 0], [16, 0]],
        /* +5  */ [[6, 4], [7, 3], [8, 3], [9, 2], [10, 2], [11, 1], [12, 0], [14, 0], [16, 0], [18, 0]],
        /* +7  */ [[7, 4], [8, 3], [9, 2], [10, 2], [11, 2], [12, 1], [14, 0], [16, 0], [18, 0], [, 0]],
        /* +9  */ [[8, 3], [9, 3], [10, 2], [11, 2], [12, 2], [14, 1], [16, 0], [18, 0], [, 0], [, 0]],
        /* 11+ */ [[9, 3], [10, 2], [11, 2], [12, 2], [14, 2], [16, 1], [18, 1], [, 0], [, 0], [, 0]],       
    ]
    
    

    const [e, ls] = getDamage(quotientDattaque, diceroll, results);
    if (e === undefined) {
        state.enduranceAdv = 0
    } else {
        state.enduranceAdv = Math.max(0, enduranceAdv - e);
        console.log(e, state.enduranceAdv)
    }
    if (ls === undefined) {
        state.enduranceCurrentLS = 0;
    } else {
        state.enduranceCurrentLS =  Math.max(0, enduranceCurrentLS - ls);
        console.log(e, state.enduranceCurrentLS)
    }
    
    state.fightLocked = false;
    console.log({state});
    return {...state};
}

function getDamage(quotientDattaque: number, diceroll: number, table: (number|undefined)[][][]) {
    if (quotientDattaque < -11) {
        return table[0][diceroll];
     }
     if (quotientDattaque < -9) {
         return table[1][diceroll];
     }
     if (quotientDattaque < -7) {
         return table[2][diceroll];
     }
     if (quotientDattaque < -5) {
         return table[3][diceroll];
     }
     if (quotientDattaque < -3) {
         return table[4][diceroll];
     }
     if (quotientDattaque < -1) {
         return table[5][diceroll];
     }
     if (quotientDattaque === 0) {
         return table[6][diceroll];
     }
     if (quotientDattaque < 3) {
         return table[7][diceroll];
     }
     if (quotientDattaque < 5) {
         return table[8][diceroll]; 
     }
     if (quotientDattaque < 7) {
         return table[9][diceroll];
     }
     if (quotientDattaque < 9) {
         return table[10][diceroll];
     }
     if (quotientDattaque < 11) {
         return table[11][diceroll];
     }
         return table[12][diceroll];
}