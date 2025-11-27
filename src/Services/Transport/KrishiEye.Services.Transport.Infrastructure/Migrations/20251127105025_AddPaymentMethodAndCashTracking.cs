using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KrishiEye.Services.Transport.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPaymentMethodAndCashTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsCashReceived",
                table: "TransportRequests",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "PaymentMethod",
                table: "TransportRequests",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCashReceived",
                table: "TransportRequests");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "TransportRequests");
        }
    }
}
