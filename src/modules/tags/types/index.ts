import { ApiProperty } from '@nestjs/swagger';

export interface Message {
  msg: string;
}

export class DeleteTagResponse {
  @ApiProperty({ example: 'Вы успешно удалили тег: ' })
  msg: string;
}

export class TagResponse {
  @ApiProperty({ example: 'kdkslfl;sdkqkeq3k2q' })
  _id: string;

  @ApiProperty({ example: '#node.js' })
  title: string;
}
