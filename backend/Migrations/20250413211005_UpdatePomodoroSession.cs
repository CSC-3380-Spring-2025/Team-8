using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyVerseBackend.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePomodoroSession : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPaused",
                table: "PomodoroSessions",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPaused",
                table: "PomodoroSessions");
        }
    }
}
