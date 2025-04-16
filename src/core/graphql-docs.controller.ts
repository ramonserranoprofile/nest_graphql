// src/core/graphql-docs.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiConsumes, ApiProduces } from '@nestjs/swagger';


@ApiBearerAuth('JWT-auth') // Opcional: Si usas autenticación JWT
@ApiTags('GraphQL') // Opcional: agrupa los endpoints en Swagger UI
@Controller('api-doc') // Cambia la ruta base si es necesario
export class GraphQLDocsController {
    /**
     * Este endpoint existe solo para documentación en Swagger.
     * No es funcional para consultas GraphQL reales.
     */
    @Get('/graphql')
    //@ApiExcludeEndpoint() // Oculta este endpoint GET si no lo necesitas
    @ApiOperation({ 
        summary: 'Endpoint principal GraphQL (solo para documentación, el real es el GET api/graphql)',
        description: 'Muestra la UI para hacer consultas GraphQL'
    })
    getGraphQL() {
        return { 
        message: 'El endpoint GraphQL funciona mediante POST y el GET muestra la UI de swagger para hacer consultas',
        note: 'Este endpoint es solo para documentación y el real es el POST api/graphql', 
        };
    }

    /**
     * Documentación del endpoint POST para GraphQL
     */
    @Post('/graphql')
    @ApiOperation({ 
        summary: 'Endpoint principal GraphQL (Solo para documentación, el real es el POST api/graphql)',
        description: 'Ejecuta consultas, mutaciones y suscripciones GraphQL'
    })
    @ApiBody({
        description: 'Consulta GraphQL',
        examples: {
        query: {
            summary: 'Consulta simple',
            value: {
            query: '{ users { id name email } }'
            }
        },
        mutation: {
            summary: 'Mutación con variables',
            value: {
            query: 'mutation CreateUser($input: UserInput!) { createUser(input: $input) { id } }',
            variables: { input: { name: 'John', email: 'john@example.com' } }
            }
        }
        },
        schema: {
        type: 'object',
        properties: {
            query: { 
            type: 'string',
            description: 'Consulta GraphQL en formato string' 
            },
            variables: { 
            type: 'object',
            nullable: true,
            description: 'Variables para la consulta' 
            },
            operationName: { 
            type: 'string',
            nullable: true,
            description: 'Nombre de la operación (para consultas con múltiples operaciones)' 
            }
        }
        }
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Respuesta GraphQL estándar',
        schema: {
        type: 'object',
        example: {
            data: { 
            users: [
                { id: '1', name: 'John Doe', email: 'john@example.com' }
            ] 
            }
        }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Error en la consulta',
        schema: {
        type: 'object',
        example: {
            errors: [
            {
                message: 'Syntax Error: Unexpected Name "x"',
                locations: [{ line: 1, column: 2 }]
            }
            ]
        }
        }
    })
    postGraphQL(@Body() body: any) {
        // Este es solo un mock para la documentación
        return {
        note: 'Este es un mock para Swagger. Las consultas reales deben hacerse directamente al endpoint GraphQL',
        exampleResponse: {
            data: body.query.includes('mutation') 
            ? { createUser: { id: '1' } }
            : { users: [] }
        }
        };
    }
}