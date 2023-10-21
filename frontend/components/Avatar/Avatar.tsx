import Image from 'next/image';
import { ChangeUserData } from '../ChangeUserData/ChangeUserData';
import styles from './Avatar.module.scss';
import { AvatarProps } from './Avatar.props';
import cn from 'classnames';
import React from 'react';
//=========================================================================================================================

// Компонент Аватар. Размер зависит от соответствующего пропса size
export const Avatar = ({ userName, userAvatar, userMail = '', size = 'medium', ...props }: AvatarProps): JSX.Element => {
	const [isPopupOpen, setIsPopupOpen] = React.useState<boolean>(false);

	return (
		<>
			<div className={cn(styles.avatar, {
				[styles.small]: size === 'small',
				[styles.medium]: size === 'medium',
				[styles.big]: size === 'big'
			})}
				{...props}
			>
				<Image
					src={userAvatar ? `${process.env.NEXT_PUBLIC_SERVER_URL}${userAvatar}` : '/icons/noAvatar.svg'}
					alt='Avatar'
					width={size === 'big' ? 45 : size === 'medium' ? 35 : 27}
					height={size === 'big' ? 45 : size === 'medium' ? 35 : 27}
				/>
				{userName?.length > 0 &&
					<p className={styles.userName} onClick={() => setIsPopupOpen(!isPopupOpen)}>
						{userName}
						<span>{userMail}</span>
					</p>}
			</div>
			{isPopupOpen && <ChangeUserData setIsPopupOpen={setIsPopupOpen} />}
		</>
	);
};