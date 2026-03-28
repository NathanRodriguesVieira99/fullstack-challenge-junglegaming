import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class MockJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // pega o header Authorization na requisição
    const authHeader = request.headers.authorization;

    // se não tiver o token retorna 401
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("No token provided");
    }

    // se tiver token define um usuário mockados
    request.user = {
      userId: "test-user-id",
      username: "testuser",
    };
    return true;
  }
}
