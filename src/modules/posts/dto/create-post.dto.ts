import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    default: 'Название моей новой статьи',
  })
  title: string;

  @ApiProperty({
    default:
      'Моя новая статья о чём-то там повествтует, но я сам не зная о чём',
  })
  desc: string;

  @ApiProperty({
    default: '/uploads/928576077bb828ef63.jpg',
  })
  image: string;

  @ApiProperty({
    default: ['64ae4c50642b6d2af5568934', '64b642e9c0d18ad32c12cce2'],
  })
  tags: string[];

  @ApiProperty({
    default:
      'Текст моей новой статьи, который должен быть больше ' +
      '200 симболов в длину, но если он таковым не будет, то я просто ' +
      'поймаю ошибку, а это не круто. Кста статья, ну судя по тегам, про бек на JS',
  })
  text: string;
}
