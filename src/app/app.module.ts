import { Module } from '@nestjs/common';
import { CommonModule } from './common';
import { AccountModule } from '@/modules/account';
import { AuthModule } from '@/modules/auth';
import { SessionModule } from '@/modules/session';
import { FileModule } from '@/modules/file';
import { NewsModule } from '@/modules/news';
import { MenuModule } from '@/modules/menu';
import { SupportMailModule } from '@/modules/support-mail';
import { MaterailModule } from '@/modules/material';
import { TagModule } from '@/modules/tag';
import { PageModule } from '@/modules/page';

@Module({
  imports: [
    CommonModule,
    AccountModule,
    AuthModule,
    SessionModule,
    FileModule,
    MenuModule,
    PageModule,
    NewsModule,
    SupportMailModule,
    MaterailModule,
    TagModule,
  ],
})
export class AppModule {}
