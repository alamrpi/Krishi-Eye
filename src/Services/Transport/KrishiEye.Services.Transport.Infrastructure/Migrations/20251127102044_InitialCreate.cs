using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KrishiEye.Services.Transport.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:postgis", ",,");

            migrationBuilder.CreateTable(
                name: "TransporterProfiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ContactNumber = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    TradeLicenseNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Latitude = table.Column<decimal>(type: "numeric", nullable: false),
                    Longitude = table.Column<decimal>(type: "numeric", nullable: false),
                    Division = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    District = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Thana = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    PostalCode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    AddressLine = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ServiceRadiusKm = table.Column<int>(type: "integer", nullable: false, defaultValue: 50),
                    IsVerified = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    Rating = table.Column<decimal>(type: "numeric(3,1)", precision: 3, scale: 1, nullable: false, defaultValue: 0.0m),
                    TotalJobs = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransporterProfiles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TransportRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RequesterId = table.Column<Guid>(type: "uuid", nullable: false),
                    ScheduledTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PickupAddress = table.Column<string>(type: "text", nullable: false),
                    PickupLatitude = table.Column<decimal>(type: "numeric(9,6)", precision: 9, scale: 6, nullable: false),
                    PickupLongitude = table.Column<decimal>(type: "numeric(9,6)", precision: 9, scale: 6, nullable: false),
                    PickupDivision = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    PickupDistrict = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    PickupThana = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    PickupPostalCode = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    PickupAddressLine = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    DropAddress = table.Column<string>(type: "text", nullable: false),
                    DropLatitude = table.Column<decimal>(type: "numeric(9,6)", precision: 9, scale: 6, nullable: false),
                    DropLongitude = table.Column<decimal>(type: "numeric(9,6)", precision: 9, scale: 6, nullable: false),
                    DropDivision = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DropDistrict = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DropThana = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DropPostalCode = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    DropAddressLine = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    GoodsType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    WeightKg = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false, defaultValue: "Open"),
                    WinnerBidId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransportRequests", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Drivers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TransporterId = table.Column<Guid>(type: "uuid", nullable: false),
                    FullName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Phone = table.Column<string>(type: "character varying(15)", maxLength: 15, nullable: false),
                    LicenseNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    LicenseExpiryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LicenseImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    NidNumber = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false, defaultValue: "Active"),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drivers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Drivers_TransporterProfiles_TransporterId",
                        column: x => x.TransporterId,
                        principalTable: "TransporterProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Vehicles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TransporterId = table.Column<Guid>(type: "uuid", nullable: false),
                    RegNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    CapacityTon = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false),
                    FitnessExpiryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DocumentsUrl = table.Column<string>(type: "jsonb", nullable: true),
                    Model = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ManufactureYear = table.Column<int>(type: "integer", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vehicles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vehicles_TransporterProfiles_TransporterId",
                        column: x => x.TransporterId,
                        principalTable: "TransporterProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TransportBids",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RequestId = table.Column<Guid>(type: "uuid", nullable: false),
                    TransporterId = table.Column<Guid>(type: "uuid", nullable: false),
                    BidAmount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    Currency = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false, defaultValue: "BDT"),
                    BidTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    Note = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false, defaultValue: "Pending"),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransportBids", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TransportBids_TransportRequests_RequestId",
                        column: x => x.RequestId,
                        principalTable: "TransportRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TransportBids_TransporterProfiles_TransporterId",
                        column: x => x.TransporterId,
                        principalTable: "TransporterProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "JobAssignments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RequestId = table.Column<Guid>(type: "uuid", nullable: false),
                    VehicleId = table.Column<Guid>(type: "uuid", nullable: false),
                    DriverId = table.Column<Guid>(type: "uuid", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobAssignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JobAssignments_Drivers_DriverId",
                        column: x => x.DriverId,
                        principalTable: "Drivers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_JobAssignments_TransportRequests_RequestId",
                        column: x => x.RequestId,
                        principalTable: "TransportRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_JobAssignments_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Drivers_LicenseNumber",
                table: "Drivers",
                column: "LicenseNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Drivers_Transporter_Status",
                table: "Drivers",
                columns: new[] { "TransporterId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_JobAssignments_DriverId",
                table: "JobAssignments",
                column: "DriverId");

            migrationBuilder.CreateIndex(
                name: "IX_JobAssignments_Request",
                table: "JobAssignments",
                column: "RequestId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_JobAssignments_VehicleId",
                table: "JobAssignments",
                column: "VehicleId");

            migrationBuilder.CreateIndex(
                name: "IX_TransportBids_Request_Transporter",
                table: "TransportBids",
                columns: new[] { "RequestId", "TransporterId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TransportBids_Status",
                table: "TransportBids",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_TransportBids_TransporterId",
                table: "TransportBids",
                column: "TransporterId");

            migrationBuilder.CreateIndex(
                name: "IX_TransporterProfiles_Location",
                table: "TransporterProfiles",
                columns: new[] { "Latitude", "Longitude" });

            migrationBuilder.CreateIndex(
                name: "IX_TransporterProfiles_UserId",
                table: "TransporterProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TransportRequests_PickupDistrict",
                table: "TransportRequests",
                column: "PickupDistrict");

            migrationBuilder.CreateIndex(
                name: "IX_TransportRequests_PickupLocation",
                table: "TransportRequests",
                columns: new[] { "PickupLatitude", "PickupLongitude" });

            migrationBuilder.CreateIndex(
                name: "IX_TransportRequests_Requester",
                table: "TransportRequests",
                column: "RequesterId");

            migrationBuilder.CreateIndex(
                name: "IX_TransportRequests_Status",
                table: "TransportRequests",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_RegNumber",
                table: "Vehicles",
                column: "RegNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_Transporter_Status",
                table: "Vehicles",
                columns: new[] { "TransporterId", "Status" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobAssignments");

            migrationBuilder.DropTable(
                name: "TransportBids");

            migrationBuilder.DropTable(
                name: "Drivers");

            migrationBuilder.DropTable(
                name: "Vehicles");

            migrationBuilder.DropTable(
                name: "TransportRequests");

            migrationBuilder.DropTable(
                name: "TransporterProfiles");
        }
    }
}
