import { useEffect } from 'react';
import { Action, Stats} from './reducer'

type FormProps = {
    stats: Stats;
    dispatch: (action: Action) => void
}

function ignoreIfNotNumber(input: string, callback: (value: number) => void) {
    const value = Number(input);
    if (isNaN(value)) {
        return;
    }
    return callback(value);
}

export const Form = (props: FormProps) => {
    const { stats, dispatch } = props;
 
    return (<div>
        <form>
            <div style={{ display: 'flex', flexDirection: 'row', padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', marginRight: 10 }}>
                    <h3>Loup Solitaire</h3>
                    <label htmlFor="habileteLS">Habileté</label>
                    <input name="habileteLS" value={String(props.stats.habileteLS ?? '')}
                        onChange={(e) => ignoreIfNotNumber(e.currentTarget.value, (value) => {
                            dispatch({type: 'set_habilete_ls', payload: value});
                        })}
                    ></input>
                    <label htmlFor="habileteBonusLS">Bonus</label>
                    <input name="habileteBonusLS" value={String(props.stats.habileteBonusLS ?? '')}
                        onChange={(e) => ignoreIfNotNumber(e.currentTarget.value, (value) => {
                            dispatch({type: 'set_habilete_bonus_ls', payload: value});
                        })}
                    ></input>
                    <label htmlFor="enduranceMaxLS">Endurance (max)</label>
                    <input name="enduranceMaxLS" value={String(props.stats.enduranceMaxLS ?? '')}
                        onChange={(e) => ignoreIfNotNumber(e.currentTarget.value, (value) => {
                            dispatch({type: 'set_endurance_max_ls', payload: value});
                        })}
                    ></input>
                    <label htmlFor="enduranceCurrentLS">Endurance (actuelle)</label>
                    <input name="enduranceCurrentLS" value={String(props.stats.enduranceCurrentLS ?? '')}
                        onChange={(e) => ignoreIfNotNumber(e.currentTarget.value, (value) => {
                            dispatch({type: 'set_endurance_current_ls', payload: value});

                        })}
                    ></input>
                    <button type="button" onClick={() => {
                        dispatch({type: 'inc_endurance_current_ls'});
                    }}>+1</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3>Adversaire</h3>
                <label htmlFor="habileteAdv">Habileté</label>
                    <input name="habileteAdv" value={String(props.stats.habileteAdv ?? '')}
                        onChange={(e) => ignoreIfNotNumber(e.currentTarget.value, (value) => {
                            dispatch({type: 'set_habilete_adv', payload: value});
                        })}
                    ></input>
                    <label htmlFor="enduranceAdv">Endurance</label>
                    <input name="enduranceAdv" value={String(props.stats.enduranceAdv ?? '')}
                        onChange={(e) => ignoreIfNotNumber(e.currentTarget.value, (value) => {
                            dispatch({type: 'set_endurance_adv', payload: value});
                        })}
                    ></input>
                    <button type="button" onClick={() => {
                        dispatch({type: 'reset_adv'});
                    }}>Nouvel adversaire</button>
                </div>
            </div>

        </form>
    </div>);
}
