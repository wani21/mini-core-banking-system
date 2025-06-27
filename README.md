
# Core Banking System

A comprehensive Core Banking System built with Java Spring Boot, featuring role-based authentication, KYC management, transaction processing, and more.

## Features

- **Role-based Authentication**: Admin and Customer roles with JWT token-based security
- **KYC Management**: Customer onboarding and document verification
- **Account Management**: Savings, Current, and Fixed Deposit accounts
- **Transaction Processing**: Deposits, withdrawals, and fund transfers
- **Interest Calculation**: Automated interest calculation for savings and fixed deposits
- **Reporting**: Transaction history, account statements, and passbook generation
- **Audit Trail**: Comprehensive logging and audit functionality

## Technology Stack

- **Backend**: Java 17, Spring Boot 3.2+
- **Database**: MySQL 8.0+
- **Security**: Spring Security with JWT
- **ORM**: Hibernate/JPA
- **Migration**: Flyway
- **Build Tool**: Maven
- **Logging**: SLF4J with Logback

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- IDE (IntelliJ IDEA, Eclipse, VS Code)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd core-banking-system
```

### 2. Database Setup

```sql
CREATE DATABASE core_banking_db;
CREATE USER 'banking_user'@'localhost' IDENTIFIED BY 'banking_password';
GRANT ALL PRIVILEGES ON core_banking_db.* TO 'banking_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configuration

Update `src/main/resources/application.yml` with your database credentials:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/core_banking_db
    username: banking_user
    password: banking_password
```

### 4. Build and Run

```bash
# Build the project
mvn clean compile

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Health Check
- `GET /actuator/health` - Application health status

## Project Structure

```
src/
├── main/
│   ├── java/com/corebanking/
│   │   ├── config/          # Configuration classes
│   │   ├── security/        # Security components
│   │   ├── common/          # Common utilities and base classes
│   │   ├── exception/       # Exception handling
│   │   └── CoreBankingApplication.java
│   └── resources/
│       ├── db/migration/    # Database migration scripts
│       ├── application.yml  # Main configuration
│       └── logback-spring.xml # Logging configuration
```

## Development Phases

This project follows a structured development approach:

1. **Phase 1**: Project Setup & Architecture ✅
2. **Phase 2**: Database Design & Core Entities
3. **Phase 3**: Authentication & Authorization
4. **Phase 4**: KYC & Account Management
5. **Phase 5**: Core Banking Operations
6. **Phase 6**: Savings & Fixed Deposit Management
7. **Phase 7**: Reporting & Analytics
8. **Phase 8**: API Development & Integration
9. **Phase 9**: Testing & Quality Assurance
10. **Phase 10**: Deployment & Monitoring

## Default Credentials

- **Admin**: username: `admin`, password: `admin123`
- **Customer**: username: `customer1`, password: `customer123`

## Environment Profiles

- **Development**: `application-dev.yml`
- **Production**: `application-prod.yml`

Run with specific profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## Contributing

1. Follow the existing code structure and naming conventions
2. Write unit tests for new features
3. Update documentation for any new endpoints or features
4. Follow the phase-wise development approach

## License

This project is licensed under the MIT License.
