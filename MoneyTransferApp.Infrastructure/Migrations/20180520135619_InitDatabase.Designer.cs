﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using MoneyTransferApp.Infrastructure.Data;
using System;

namespace MoneyTransferApp.Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20180520135619_InitDatabase")]
    partial class InitDatabase
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.0-rtm-26452")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("MoneyTransferApp.Core.Entities.Client.Customer", b =>
                {
                    b.Property<int>("CustomerId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Address")
                        .HasColumnType("varchar(512)")
                        .HasMaxLength(512);

                    b.Property<Guid?>("CreatedBy");

                    b.Property<DateTimeOffset?>("CreatedOn");

                    b.Property<string>("CustomerCode")
                        .HasColumnType("varchar(10)")
                        .HasMaxLength(10);

                    b.Property<int?>("CustomerType");

                    b.Property<Guid?>("DeletedBy");

                    b.Property<DateTimeOffset?>("DeletedOn");

                    b.Property<string>("Email")
                        .HasColumnType("varchar(128)")
                        .HasMaxLength(128);

                    b.Property<string>("FullName")
                        .HasColumnType("varchar(256)")
                        .HasMaxLength(256);

                    b.Property<string>("Phone")
                        .HasColumnType("varchar(50)")
                        .HasMaxLength(50);

                    b.Property<Guid?>("UpdatedBy");

                    b.Property<DateTimeOffset?>("UpdatedOn");

                    b.HasKey("CustomerId");

                    b.ToTable("Customer","Client");
                });

            modelBuilder.Entity("MoneyTransferApp.Core.Entities.Client.Receiver", b =>
                {
                    b.Property<int>("ReceiverId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("BankAccount")
                        .HasColumnType("varchar(50)")
                        .HasMaxLength(50);

                    b.Property<string>("BankName");

                    b.Property<string>("BranchName")
                        .HasColumnType("varchar(256)")
                        .HasMaxLength(256);

                    b.Property<Guid?>("CreatedBy");

                    b.Property<DateTimeOffset?>("CreatedOn");

                    b.Property<int>("CustomerId");

                    b.Property<Guid?>("DeletedBy");

                    b.Property<DateTimeOffset?>("DeletedOn");

                    b.Property<string>("District")
                        .HasColumnType("varchar(128)")
                        .HasMaxLength(128);

                    b.Property<string>("IDIssueDate");

                    b.Property<string>("Province")
                        .HasColumnType("varchar(128)")
                        .HasMaxLength(128);

                    b.Property<string>("ReceiverIdentityCard")
                        .HasColumnType("varchar(100)")
                        .HasMaxLength(100);

                    b.Property<string>("ReceiverName")
                        .HasColumnType("varchar(256)")
                        .HasMaxLength(256);

                    b.Property<string>("ReceiverPhone1")
                        .HasColumnType("varchar(50)")
                        .HasMaxLength(50);

                    b.Property<string>("ReceiverPhone2")
                        .HasColumnType("varchar(50)")
                        .HasMaxLength(50);

                    b.Property<Guid?>("UpdatedBy");

                    b.Property<DateTimeOffset?>("UpdatedOn");

                    b.HasKey("ReceiverId");

                    b.HasIndex("CustomerId");

                    b.ToTable("Receiver","Client");
                });

            modelBuilder.Entity("MoneyTransferApp.Core.Entities.Client.Transaction", b =>
                {
                    b.Property<int>("TransactionId")
                        .ValueGeneratedOnAdd();

                    b.Property<double>("Amount");

                    b.Property<Guid?>("CreatedBy");

                    b.Property<DateTimeOffset?>("CreatedOn");

                    b.Property<int>("CurrencyId");

                    b.Property<int>("CustomerId");

                    b.Property<Guid?>("DeletedBy");

                    b.Property<DateTimeOffset?>("DeletedOn");

                    b.Property<int>("ReceiverId");

                    b.Property<int?>("Status");

                    b.Property<string>("TransactionNo")
                        .HasColumnType("varchar(50)")
                        .HasMaxLength(50);

                    b.Property<Guid?>("UpdatedBy");

                    b.Property<DateTimeOffset?>("UpdatedOn");

                    b.HasKey("TransactionId");

                    b.HasIndex("CustomerId");

                    b.HasIndex("ReceiverId");

                    b.ToTable("Transaction","Client");
                });

            modelBuilder.Entity("MoneyTransferApp.Core.Entities.Users.Role", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("RoleId");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasMaxLength(36);

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("Role","User");
                });

            modelBuilder.Entity("MoneyTransferApp.Core.Entities.Users.RoleClaim", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("RoleClaimId");

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<Guid>("RoleId");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("RoleClaim","User");
                });

            modelBuilder.Entity("MoneyTransferApp.Core.Entities.Users.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("UserId");

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("Address")
                        .HasColumnType("varchar(512)")
                        .HasMaxLength(512);

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasMaxLength(36);

                    b.Property<Guid?>("CreatedBy");

                    b.Property<DateTimeOffset?>("CreatedOn");

                    b.Property<Guid?>("DeletedBy");

                    b.Property<DateTimeOffset?>("DeletedOn");

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<string>("FirstName")
                        .HasMaxLength(128);

                    b.Property<DateTimeOffset?>("LastLogin");

                    b.Property<string>("LastName")
                        .HasMaxLength(128);

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash")
                        .HasMaxLength(256);

                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(20);

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp")
                        .HasMaxLength(36);

                    b.Property<string>("StoreName")
                        .HasMaxLength(256);

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<Guid?>("UpdatedBy");

                    b.Property<DateTimeOffset?>("UpdatedOn");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("User","User");
                });

            modelBuilder.Entity("MoneyTransferApp.Core.Entities.Users.UserClaim", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("UserClaimId");

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<Guid>("UserId")
                        .HasColumnName("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("UserClaim","User");
                });

            modelBuilder.Entity("MoneyTransferApp.Core.Entities.Users.UserLogin", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<Guid>("UserId");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("UserLogin","User");
                });

            modelBuilder.Entity("MoneyTransferApp.Core.Entities.Users.UserRole", b =>
                {
                    b.Property<Guid>("UserId");

                    b.Property<Guid>("RoleId");

                    b.Property<Guid?>("RoleId1");

                    b.Property<Guid?>("UserId1");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.HasIndex("RoleId1");

                    b.HasIndex("UserId1");

                    b.ToTable("UserRole","User");
                });

            modelBuilder.Entity("MoneyTransferApp.Core.Entities.Users.UserToken", b =>
                {
                    b.Property<Guid>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("UserToken","User");
                });

            modelBuilder.Entity("MoneyTransferApp.Core.Entities.Client.Receiver", b =>
                {
                    b.HasOne("MoneyTransferApp.Core.Entities.Client.Customer", "Customer")
                        .WithMany()
                        .HasForeignKey("CustomerId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MoneyTransferApp.Core.Entities.Client.Transaction", b =>
                {
                    b.HasOne("MoneyTransferApp.Core.Entities.Client.Customer", "Customer")
                        .WithMany()
                        .HasForeignKey("CustomerId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("MoneyTransferApp.Core.Entities.Client.Receiver", "Receiver")
                        .WithMany()
                        .HasForeignKey("ReceiverId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MoneyTransferApp.Core.Entities.Users.RoleClaim", b =>
                {
                    b.HasOne("MoneyTransferApp.Core.Entities.Users.Role")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MoneyTransferApp.Core.Entities.Users.UserClaim", b =>
                {
                    b.HasOne("MoneyTransferApp.Core.Entities.Users.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MoneyTransferApp.Core.Entities.Users.UserLogin", b =>
                {
                    b.HasOne("MoneyTransferApp.Core.Entities.Users.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MoneyTransferApp.Core.Entities.Users.UserRole", b =>
                {
                    b.HasOne("MoneyTransferApp.Core.Entities.Users.Role")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("MoneyTransferApp.Core.Entities.Users.Role", "Role")
                        .WithMany("UserRoles")
                        .HasForeignKey("RoleId1");

                    b.HasOne("MoneyTransferApp.Core.Entities.Users.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("MoneyTransferApp.Core.Entities.Users.User", "User")
                        .WithMany("UserRoles")
                        .HasForeignKey("UserId1");
                });

            modelBuilder.Entity("MoneyTransferApp.Core.Entities.Users.UserToken", b =>
                {
                    b.HasOne("MoneyTransferApp.Core.Entities.Users.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
