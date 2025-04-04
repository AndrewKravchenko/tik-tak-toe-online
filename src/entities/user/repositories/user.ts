import { prisma } from '@/shared/lib/db'
import { UserEntity } from '../domain'
import { Prisma } from '@prisma/client'

export function createUser(user: Omit<UserEntity, 'id'>): Promise<UserEntity> {
  return prisma.user.create({
    data: user,
  })
}

export function updateUser(user: UserEntity): Promise<UserEntity> {
  return prisma.user.update({
    where: {
      id: user.id,
    },
    data: user,
  })
}

export function getUser(where: Prisma.UserWhereInput) {
  return prisma.user.findFirst({ where })
}

export const userRepository = { createUser, updateUser, getUser }
