﻿// <auto-generated />
using System;
using LearnUniVerse.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace LearnUniVerse.Migrations
{
    [DbContext(typeof(DbContextClass))]
    [Migration("20230807160542_Initial")]
    partial class Initial
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("LearnUniVerse.Model.Ateneo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("NomeAteneo")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Atenei");
                });

            modelBuilder.Entity("LearnUniVerse.Model.Corso", b =>
                {
                    b.Property<int?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("Id"), 1L, 1);

                    b.Property<int>("IdMateria")
                        .HasColumnType("int");

                    b.Property<int>("IdUtente")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("IdMateria");

                    b.HasIndex("IdUtente");

                    b.ToTable("Corsi");
                });

            modelBuilder.Entity("LearnUniVerse.Model.CorsoDiStudi", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("NomeCorso")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("CorsoDiStudi");
                });

            modelBuilder.Entity("LearnUniVerse.Model.Materia", b =>
                {
                    b.Property<int?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("Id"), 1L, 1);

                    b.Property<int>("IdCorsoDiStudi")
                        .HasColumnType("int");

                    b.Property<string>("Nome")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Materie");
                });

            modelBuilder.Entity("LearnUniVerse.Model.Messaggio", b =>
                {
                    b.Property<int?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("Id"), 1L, 1);

                    b.Property<string>("Content")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("From")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("IdCorso")
                        .HasColumnType("int");

                    b.Property<string>("To")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Messaggi");
                });

            modelBuilder.Entity("LearnUniVerse.Model.Recensione", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("IdCorso")
                        .HasColumnType("int");

                    b.Property<int>("IdUtente")
                        .HasColumnType("int");

                    b.Property<int>("NumStelle")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Recensioni");
                });

            modelBuilder.Entity("LearnUniVerse.Model.Syllabus", b =>
                {
                    b.Property<int?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("Id"), 1L, 1);

                    b.Property<string>("ArgomentoLezione")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("IdCorso")
                        .HasColumnType("int");

                    b.Property<int>("NumLezione")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("IdCorso");

                    b.ToTable("Syllabus");
                });

            modelBuilder.Entity("LearnUniVerse.Model.Utente", b =>
                {
                    b.Property<int?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("Id"), 1L, 1);

                    b.Property<int>("AnnoImmatricolazione")
                        .HasColumnType("int");

                    b.Property<string>("Cognome")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("DataDiNascita")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("IdAteneo")
                        .HasColumnType("int");

                    b.Property<int>("IdCorsoDiStudi")
                        .HasColumnType("int");

                    b.Property<string>("Nome")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("IdAteneo");

                    b.HasIndex("IdCorsoDiStudi");

                    b.ToTable("Utenti");
                });

            modelBuilder.Entity("LearnUniVerse.Model.Corso", b =>
                {
                    b.HasOne("LearnUniVerse.Model.Materia", "Materia")
                        .WithMany()
                        .HasForeignKey("IdMateria")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("LearnUniVerse.Model.Utente", "Utente")
                        .WithMany()
                        .HasForeignKey("IdUtente")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Materia");

                    b.Navigation("Utente");
                });

            modelBuilder.Entity("LearnUniVerse.Model.Syllabus", b =>
                {
                    b.HasOne("LearnUniVerse.Model.Corso", "Corso")
                        .WithMany()
                        .HasForeignKey("IdCorso")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Corso");
                });

            modelBuilder.Entity("LearnUniVerse.Model.Utente", b =>
                {
                    b.HasOne("LearnUniVerse.Model.Ateneo", "Ateneo")
                        .WithMany()
                        .HasForeignKey("IdAteneo")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("LearnUniVerse.Model.CorsoDiStudi", "CorsoDiStudi")
                        .WithMany()
                        .HasForeignKey("IdCorsoDiStudi")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Ateneo");

                    b.Navigation("CorsoDiStudi");
                });
#pragma warning restore 612, 618
        }
    }
}
