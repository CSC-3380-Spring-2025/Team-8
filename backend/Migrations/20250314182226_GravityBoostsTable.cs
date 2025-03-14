using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace StudyVerseBackend.Migrations
{
    /// <inheritdoc />
    public partial class GravityBoostsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GravityBoosts",
                columns: table => new
                {
                    Boost_Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Message = table.Column<string>(type: "text", nullable: false),
                    Sent_At = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Sender_Id = table.Column<string>(type: "text", nullable: false),
                    Receiver_Id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GravityBoosts", x => x.Boost_Id);
                    table.ForeignKey(
                        name: "FK_GravityBoosts_AspNetUsers_Receiver_Id",
                        column: x => x.Receiver_Id,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GravityBoosts_AspNetUsers_Sender_Id",
                        column: x => x.Sender_Id,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GravityBoosts_Receiver_Id",
                table: "GravityBoosts",
                column: "Receiver_Id");

            migrationBuilder.CreateIndex(
                name: "IX_GravityBoosts_Sender_Id",
                table: "GravityBoosts",
                column: "Sender_Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GravityBoosts");
        }
    }
}
