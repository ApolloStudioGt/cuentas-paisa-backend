import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class UserIdGuard implements CanActivate {

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        if (request.user && request.body) {
            request.body.userId = request.user.uid;
        }
        return true;
    }
}