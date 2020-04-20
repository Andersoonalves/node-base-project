import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import uploadConfig from '../config/upload';
import User from '../models/User';

interface RequestDTO {
    user_id: string;
    avatarFileName: string;
}

/**
 * Service to update a user avatar.
 */
class UpdateUserAvatarService {
    public async execute({
        user_id,
        avatarFileName,
    }: RequestDTO): Promise<User> {
        const usersRepository = getRepository(User);

        // find a user
        const user = await usersRepository.findOne(user_id);

        if (!user) {
            throw new Error('Only authenticated users can change avatar!');
        }

        // check if already exist an avatar, if true, delete it.
        if (user.avatar) {
            // get current avatar path
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );
            // check if exist with fs (file system)
            const userAvatarFileExists = await fs.promises.stat(
                userAvatarFilePath,
            );
            // remove avatar with unlink
            if (userAvatarFileExists) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        // change avatar
        user.avatar = avatarFileName;
        // update user on database
        await usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
