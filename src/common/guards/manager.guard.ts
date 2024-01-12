import { CanActivate, Inject, UnauthorizedException } from "@nestjs/common";

export class ManagerGuard implements CanActivate {
    constructor(@Inject("MANAGER_TOKEN") private readonly managerToken: string) {}

    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { authorization } = request.headers;

        try {
            if (authorization.split("Bearer ")[1] !== this.managerToken) {
                throw new UnauthorizedException("Invalid Bearer token");
            }
            return true;
        } catch (error) {
            throw new UnauthorizedException("Invalid Bearer token");
        }
    }
}
