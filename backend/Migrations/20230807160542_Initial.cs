using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearnUniVerse.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Atenei",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NomeAteneo = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Atenei", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CorsoDiStudi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NomeCorso = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CorsoDiStudi", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Materie",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdCorsoDiStudi = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Materie", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Messaggi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    From = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    To = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IdCorso = table.Column<int>(type: "int", nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messaggi", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Recensioni",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdCorso = table.Column<int>(type: "int", nullable: false),
                    IdUtente = table.Column<int>(type: "int", nullable: false),
                    NumStelle = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recensioni", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Utenti",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Cognome = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DataDiNascita = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AnnoImmatricolazione = table.Column<int>(type: "int", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdAteneo = table.Column<int>(type: "int", nullable: false),
                    IdCorsoDiStudi = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Utenti", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Utenti_Atenei_IdAteneo",
                        column: x => x.IdAteneo,
                        principalTable: "Atenei",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Utenti_CorsoDiStudi_IdCorsoDiStudi",
                        column: x => x.IdCorsoDiStudi,
                        principalTable: "CorsoDiStudi",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Corsi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdUtente = table.Column<int>(type: "int", nullable: false),
                    IdMateria = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Corsi", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Corsi_Materie_IdMateria",
                        column: x => x.IdMateria,
                        principalTable: "Materie",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Corsi_Utenti_IdUtente",
                        column: x => x.IdUtente,
                        principalTable: "Utenti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Syllabus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdCorso = table.Column<int>(type: "int", nullable: false),
                    NumLezione = table.Column<int>(type: "int", nullable: false),
                    ArgomentoLezione = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Syllabus", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Syllabus_Corsi_IdCorso",
                        column: x => x.IdCorso,
                        principalTable: "Corsi",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Corsi_IdMateria",
                table: "Corsi",
                column: "IdMateria");

            migrationBuilder.CreateIndex(
                name: "IX_Corsi_IdUtente",
                table: "Corsi",
                column: "IdUtente");

            migrationBuilder.CreateIndex(
                name: "IX_Syllabus_IdCorso",
                table: "Syllabus",
                column: "IdCorso");

            migrationBuilder.CreateIndex(
                name: "IX_Utenti_IdAteneo",
                table: "Utenti",
                column: "IdAteneo");

            migrationBuilder.CreateIndex(
                name: "IX_Utenti_IdCorsoDiStudi",
                table: "Utenti",
                column: "IdCorsoDiStudi");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Messaggi");

            migrationBuilder.DropTable(
                name: "Recensioni");

            migrationBuilder.DropTable(
                name: "Syllabus");

            migrationBuilder.DropTable(
                name: "Corsi");

            migrationBuilder.DropTable(
                name: "Materie");

            migrationBuilder.DropTable(
                name: "Utenti");

            migrationBuilder.DropTable(
                name: "Atenei");

            migrationBuilder.DropTable(
                name: "CorsoDiStudi");
        }
    }
}
