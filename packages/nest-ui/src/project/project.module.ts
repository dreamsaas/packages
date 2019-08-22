import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { DateScalar } from '../common/scalars/date.scalar';

@Module({
  providers: [ProjectService, ProjectController /*, DateScalar*/],
})
export class ProjectModule {}
