import { Resolver, Args, Query } from '@nestjs/graphql';

interface iThing {
  id: number;
}

class Thing implements iThing {}

@Resolver('Thing')
export class ProjectController {
  @Query(returns => Thing)
  getThing(@Args('id') id: number): Thing {
    return { id };
  }
}
