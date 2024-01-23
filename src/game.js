import { useEffect, useState } from 'react';
import { store } from './store/store';
import { GameLayout } from './gameLayout';

export const Game = () => {
	const [state, setState] = useState(store.getState());

	useEffect(() => {
		const subscribe = store.subscribe(() => {
			setState(store.getState());
		});
		return () => subscribe();
	}, []);

	const { currentPlayer, isGameEnded, isDraw, field, winningIndex } = state;

	const handleClickCell = (index) => {
		if (field[index] === '' && isGameEnded === false) {
			const nextField = field.slice();
			nextField[index] = currentPlayer;
			store.dispatch({ type: 'SET_FIELD', payload: nextField });
			checkDraw(nextField);
			store.dispatch({
				type: 'SET_PLAYER',
				payload: currentPlayer === 'X' ? 'O' : 'X',
			});
			checkWinner(nextField);
		}
	};

	const checkDraw = (field) => {
		if (!field.includes('') && isGameEnded !== true)
			store.dispatch({ type: 'SET_IS_DRAW', payload: true });
	};

	const checkWinner = (field) => {
		const WIN_PATTERNS = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8], // Варианты побед по горизонтали
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8], // Варианты побед по вертикали
			[0, 4, 8],
			[2, 4, 6], // Варианты побед по диагонали
		];
		for (let i = 0; i < WIN_PATTERNS.length; i++) {
			const [a, b, c] = WIN_PATTERNS[i];
			if (field[a] && field[a] === field[b] && field[a] === field[c]) {
				store.dispatch({ type: 'SET_IS_GAME_ENDED', payload: true });
				store.dispatch({ type: 'SET_PLAYER', payload: currentPlayer });
				store.dispatch({ type: 'SET_IS_DRAW', payload: false });
				store.dispatch({ type: 'SET_WINNING_INDEX', payload: WIN_PATTERNS[i] });
			}
		}
	};

	const clickReset = () => {
		store.dispatch({ type: 'RESET' });
	};

	return (
		<GameLayout
			currentPlayer={currentPlayer}
			isGameEnded={isGameEnded}
			isDraw={isDraw}
			field={field}
			handleClickCell={handleClickCell}
			clickReset={clickReset}
			winningIndex={winningIndex}
		/>
	);
};
