from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity

class JWTUtils:
    @staticmethod
    def create_tokens(identity: str):
        """创建访问令牌和刷新令牌"""
        access_token = create_access_token(identity=identity)
        refresh_token = create_refresh_token(identity=identity)
        return {
            'access_token': access_token,
            'refresh_token': refresh_token
        }
    
    @staticmethod
    def get_current_user_id():
        """获取当前用户ID"""
        return get_jwt_identity()